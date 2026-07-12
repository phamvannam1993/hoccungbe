'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, ArrowRight } from 'lucide-react';
import styles from './documents.module.css';

interface Document {
  id: number;
  title: string;
  description?: string;
  slug: string;
  pdfUrl: string;
  viewCount: number;
  isActive: boolean;
  category?: { id: number; name: string; slug: string };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Toán học', slug: 'toan-hoc' },
  { id: 2, name: 'Vật Lý', slug: 'vat-ly' },
  { id: 3, name: 'Hóa Học', slug: 'hoa-hoc' },
  { id: 4, name: 'Tiếng Anh', slug: 'tieng-anh' },
  { id: 5, name: 'Văn học', slug: 'van-hoc' },
  { id: 6, name: 'Sinh Học', slug: 'sinh-hoc' },
];

const SORT_OPTIONS = [
  { label: 'Xem nhiều nhất', value: 'views' },
  { label: 'Download nhiều nhất', value: 'downloads' },
  { label: 'Mới nhất', value: 'newest' },
];

export default function DocumentsListClient() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCategories();
    fetchDocuments();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, sortBy, page]);

  const fetchCategories = async () => {
    try {
      const baseUrl = typeof window !== 'undefined'
        ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
        : 'http://localhost:3001';

      const res = await fetch(`${baseUrl}/api/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data || DEFAULT_CATEGORIES);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(DEFAULT_CATEGORIES);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const baseUrl = typeof window !== 'undefined'
        ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
        : 'http://localhost:3001';

      const query = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (selectedCategory) {
        query.append('categoryId', selectedCategory);
      }

      const url = `${baseUrl}/api/documents?${query}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setDocuments(data.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Kho Tài Liệu</h1>
          <p>Thư viện PDF miễn phí cho trẻ em</p>
        </div>
      </div>

      <div className={styles.wrapper}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h3>Danh Mục</h3>
            <nav className={styles.categoryList}>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setPage(1);
                }}
                className={`${styles.categoryItem} ${!selectedCategory ? styles.active : ''}`}
              >
                Tất cả
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id.toString());
                    setPage(1);
                  }}
                  className={`${styles.categoryItem} ${selectedCategory === cat.id.toString() ? styles.active : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <h2>{selectedCategory ? categories.find(c => c.id.toString() === selectedCategory)?.name : 'Tất cả'}</h2>
            <div className={styles.sortOptions}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`${styles.sortBtn} ${sortBy === opt.value ? styles.active : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Grid */}
          <div className={styles.grid}>
            {documents.map(doc => (
              <div key={doc.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <div className={styles.placeholder}>📄</div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    {doc.category && <span className={styles.categoryBadge}>{doc.category.name}</span>}
                  </div>
                  <h3>{doc.title}</h3>
                  {doc.description && <p>{doc.description}</p>}
                  <div className={styles.cardActions}>
                    <a
                      href={`http://localhost:3001/api/documents/download/${doc.id}`}
                      download
                      className={styles.downloadBtn}
                      title="Tải xuống"
                    >
                      <Download size={18} />
                    </a>
                    <Link href={`/tai-lieu/${doc.slug}`} className={styles.viewBtn}>
                      Xem Chi Tiết
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && <div className={styles.loading}>Đang tải...</div>}

          {documents.length === 0 && !loading && (
            <div className={styles.empty}>Không có tài liệu nào</div>
          )}
        </main>
      </div>
    </div>
  );
}
