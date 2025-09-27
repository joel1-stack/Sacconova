import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  size: number;
  uploadDate: Date;
  category: 'id' | 'payslip' | 'bank_statement' | 'loan_agreement' | 'other';
  url?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UploadResponse {
  success: boolean;
  document?: Document;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  uploadDocument(file: File, category: string, userId: string): Observable<UploadResponse> {
    return new Observable(observer => {
      // Simulate file upload
      setTimeout(() => {
        const document: Document = {
          id: 'doc_' + Date.now(),
          name: file.name,
          type: this.getFileType(file.name),
          size: file.size,
          uploadDate: new Date(),
          category: category as any,
          url: URL.createObjectURL(file),
          status: 'pending'
        };

        observer.next({ success: true, document });
        observer.complete();
      }, 2000);
    });
  }

  getDocuments(userId: string): Observable<Document[]> {
    const mockDocs: Document[] = [
      {
        id: '1',
        name: 'national_id.pdf',
        type: 'pdf',
        size: 245760,
        uploadDate: new Date('2024-01-15'),
        category: 'id',
        status: 'approved'
      },
      {
        id: '2',
        name: 'payslip_december.pdf',
        type: 'pdf',
        size: 156432,
        uploadDate: new Date('2024-01-10'),
        category: 'payslip',
        status: 'approved'
      }
    ];
    return of(mockDocs).pipe(delay(500));
  }

  deleteDocument(documentId: string): Observable<boolean> {
    return of(true).pipe(delay(1000));
  }

  generateESignature(documentId: string, signature: string): Observable<boolean> {
    // Mock e-signature generation
    return of(true).pipe(delay(2000));
  }

  downloadDocument(documentId: string): Observable<Blob> {
    // Mock document download
    return new Observable(observer => {
      fetch('/assets/sample-document.pdf')
        .then(response => response.blob())
        .then(blob => {
          observer.next(blob);
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  private getFileType(filename: string): 'pdf' | 'image' | 'doc' {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['doc', 'docx'].includes(ext || '')) return 'doc';
    return 'pdf';
  }

  validateDocument(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only PDF, JPG, PNG, and DOC files are allowed' };
    }

    return { valid: true };
  }
}