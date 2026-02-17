'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils'
import { Download, Mail, Award, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { MobileCard } from '@/components/ui/mobile-card'
import { TableSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'

export default function CertificatesPage() {
  const { addToast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/certificates')
      const data = await response.json()
      if (data.success) {
        setCertificates(data.certificates)
      } else {
        addToast({
          type: 'error',
          title: 'Failed to fetch certificates',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
      addToast({
        type: 'error',
        title: 'Failed to fetch certificates',
        description: 'An unexpected error occurred',
      })
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
        addToast({
          type: 'success',
          title: 'Certificate resent',
          description: data.message || 'Email sent successfully',
        })
        fetchCertificates()
      } else {
        addToast({
          type: 'error',
          title: 'Failed to resend certificate',
          description: data.error || 'Please try again',
        })
      }
    } catch (error) {
      console.error('Failed to resend certificate:', error)
      addToast({
        type: 'error',
        title: 'Failed to resend certificate',
        description: 'An unexpected error occurred',
      })
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
      
      addToast({
        type: 'success',
        title: 'Download started',
        description: 'Certificate is being downloaded',
      });
    } catch (error) {
      console.error('Failed to download certificate:', error);
      addToast({
        type: 'warning',
        title: 'Opening in new tab',
        description: 'Direct download failed',
      });
      // Fallback: open in new tab
      window.open(certificateUrl, '_blank');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Manage and resend student certificates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Certificates ({certificates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <TableSkeleton rows={5} />
          ) : certificates.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No certificates yet"
              description="Certificates will appear here when tasks are approved"
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Student</TableHead>
                      <TableHead className="min-w-[150px]">Task</TableHead>
                      <TableHead className="min-w-[140px] whitespace-nowrap">Issued Date</TableHead>
                      <TableHead className="min-w-[100px] whitespace-nowrap">Email Status</TableHead>
                      <TableHead className="min-w-[180px]">Actions</TableHead>
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
                        <TableCell className="whitespace-nowrap">{formatDateTime(cert.issued_at)}</TableCell>
                        <TableCell>
                          {cert.email_sent ? (
                            <Badge variant="approved">Sent</Badge>
                          ) : (
                            <Badge variant="pending">Not sent</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-5 w-5 text-slate-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleDownload(
                                  cert.certificate_url,
                                  cert.user?.name || 'Student',
                                  cert.task_submission?.task?.title || 'Task'
                                )}
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleResend(cert.id)}
                              >
                                <Mail className="h-4 w-4" />
                                Resend Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {certificates.map((cert) => (
                  <MobileCard
                    key={cert.id}
                    title={cert.user?.name || 'Unknown Student'}
                    subtitle={cert.task_submission?.task?.title || 'Unknown Task'}
                    metadata={[
                      { label: 'Email', value: cert.user?.email || 'N/A' },
                      { label: 'Issued', value: formatDateTime(cert.issued_at) },
                    ]}
                    badges={[
                      {
                        label: cert.email_sent ? 'Email Sent' : 'Email Not Sent',
                        variant: cert.email_sent ? 'approved' : 'pending',
                      },
                    ]}
                    actions={[
                      {
                        label: 'Download',
                        icon: Download,
                        onClick: () => handleDownload(
                          cert.certificate_url,
                          cert.user?.name || 'Student',
                          cert.task_submission?.task?.title || 'Task'
                        ),
                      },
                      {
                        label: 'Resend',
                        icon: Mail,
                        onClick: () => handleResend(cert.id),
                      },
                    ]}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
