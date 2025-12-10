import { projectId, publicAnonKey } from "./supabase/info";

export const uploadImageFile = async (file: File): Promise<{ url: string, path: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-5cb5e93b/upload`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${publicAnonKey}`,
         },
         body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    return await response.json();
};
