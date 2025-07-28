import { CompressAdapter, method } from "../types/compress";

export const AdapterCompress: CompressAdapter = {
    isUse: () => false,
    useBlob: () => false,
    method: (jsonStr, useBlob, filename) =>
    {
        return method(jsonStr, useBlob, filename)
    }
}