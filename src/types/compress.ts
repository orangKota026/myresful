import pako from 'pako';

export interface CompressAdapter
{
    isUse: () => boolean | false;
    useBlob: () => boolean | false;
    method: (json: string, useBlob: boolean, filename?: string) => Uint8Array | FormData;
}

export const method = (json: string, useBlob: boolean, filename?: string) =>
{
    const compressed = pako.gzip(json);

    if (useBlob)
    {
        const blob = new Blob([compressed], { type: 'application/gzip' })
        const formData = new FormData()
        formData.append('data', blob, filename || 'data.json.gz')

        return formData
    }

    return compressed
}