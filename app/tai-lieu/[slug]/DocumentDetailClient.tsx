'use client';

import { Download, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import styles from './detail.module.css';

interface Document {
  id: number;
  title: string;
  description?: string;
  slug: string;
  pdfUrl: string;
  viewCount: number;
  createdAt: string;
  category?: { id: number; name: string };
}

interface Props {
  document: Document;
}

export default function DocumentDetailClient({ document }: Props) {
  const createdDate = new Date(document.createdAt).toLocaleDateString('vi-VN');

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Trang Chủ</Link>
        <span>/</span>
        <Link href="/tai-lieu">Kho Tài Liệu</Link>
        <span>/</span>
        <span>{document.title}</span>
      </nav>

      <div className={styles.wrapper}>
        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.cover}>📄</div>
            <div className={styles.info}>
              <h1>{document.title}</h1>
              {document.description && <p className={styles.description}>{document.description}</p>}
              <div className={styles.meta}>
                {document.category && (
                  <div className={styles.metaItem}>
                    <span className={styles.categoryBadge}>{document.category.name}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <Eye size={16} />
                  <span>{document.viewCount.toLocaleString()} lượt xem</span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>Cập nhật: {createdDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <a
              href={`http://localhost:3001/api/documents/download/${document.id}`}
              download
              className={styles.downloadBtn}
            >
              <Download size={20} />
              Tải Xuống PDF
            </a>
            <button className={styles.shareBtn} onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Đã sao chép liên kết!');
            }}>
              Chia Sẻ
            </button>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            <h2>Thông Tin Tài Liệu</h2>
            <div className={styles.content}>
              <p>Đây là tài liệu học tập chất lượng cao được lựa chọn kỹ lưỡng từ các nguồn tin cậy.</p>
              <p>Tài liệu này giúp hỗ trợ quá trình học tập của trẻ em, cung cấp kiến thức bổ ích và phương pháp học hiệu quả.</p>
              <p>Bạn có thể tải xuống và sử dụng tài liệu này miễn phí cho mục đích học tập cá nhân.</p>
            </div>
          </div>

          {/* PDF Preview */}
          <div className={styles.previewSection}>
            <h2>Xem Trước</h2>
            <iframe
              src={`${document.pdfUrl}#view=FitH`}
              width="100%"
              height="600"
              frameBorder="0"
              className={styles.pdfViewer}
              title="PDF Preview"
            />
          </div>
        </main>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3>Thông Tin Chi Tiết</h3>
            <div className={styles.details}>
              <div className={styles.detailRow}>
                <span className={styles.label}>Loại:</span>
                <span className={styles.value}>Tài Liệu PDF</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Lượt Xem:</span>
                <span className={styles.value}>{document.viewCount.toLocaleString()}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Ngày Cập Nhật:</span>
                <span className={styles.value}>{createdDate}</span>
              </div>
            </div>
          </div>

          {/* Download Card */}
          <div className={styles.downloadCard}>
            <p>Tải tài liệu này ngay để học tập hiệu quả</p>
            <a
              href={`http://localhost:3001/api/documents/download/${document.id}`}
              download
              className={styles.bigDownloadBtn}
            >
              <Download size={24} />
              Tải Xuống
            </a>
          </div>

          {/* Related */}
          <div className={styles.sidebarCard}>
            <h3>Tài Liệu Khác</h3>
            <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
              <Link href="/tai-lieu" style={{ color: '#667eea', textDecoration: 'none' }}>
                Xem tất cả tài liệu →
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
