import { STORAGE_BUCKET } from '@/constants/storage';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export const useStorageImage = (path: string) => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (!path) return;

    let objectUrl = '';

    const loadImage = async () => {
      console.log('loadImage: ' + STORAGE_BUCKET + '/' + path);
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(path);
      if (data) {
        objectUrl = URL.createObjectURL(data);
        setUrl(objectUrl);
      } else {
        console.error('이미지 다운로드 실패:', error?.message);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  return url;
};
