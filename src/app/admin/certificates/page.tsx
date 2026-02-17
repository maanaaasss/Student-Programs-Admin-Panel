'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/utils'
import { Download, Mail } from 'lucide-react'

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/admin/certificates')
      const data = await response.json()
      if (data.success) {
        setCertificates(data.certificates)
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async (certId: string) => {
    try {
      const response = await fetch(`/api/admin/certificates/${certId}/resend`, {
        method: 'POST',
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message || 'Certificate email resent successfully!')
        fetchCertificates()
      }
    } catch (error) {
      console.error('Failed to resend certificate:', error)
      alert('Failed to resend certificate')
    }
  }

  const handleDownload = async (certificateUrl: string, studentName: string, taskTitle: string) => {
    try {
      // Fetch the certificate file
      const response = await fetch(certificateUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch certificate');
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename from student name and task title
      const filename = `certificate-${studentName.replace(/\s+/g, '-')}-${taskTitle.replace(/\s+/g, '-')}.pdf`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      // Fallback: open in new tab
      window.open(certificateUrl, '_blank');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-1">Manage and resend student certificates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certificates ({certificates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Email Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cert.user?.name}</p>
                      <p className="text-xs text-gray-500">{cert.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{cert.task_submission?.task?.title || 'N/A'}</TableCell>
                  <TableCell>{formatDateTime(cert.issued_at)}</TableCell>
                  <TableCell>
                    {cert.email_sent ? (
                      <span className="text-green-600 text-sm">
                        Sent {cert.email_sent_at && `on ${formatDateTime(cert.email_sent_at)}`}
                      </span>
                    ) : (
                      <span className="text-yellow-600 text-sm">Not sent</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(
                          cert.certificate_url,
                          cert.user?.name || 'Student',
                          cert.task_submission?.task?.title || 'Task'
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleResend(cert.id)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Resend
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {certificates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No certificates issued yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
