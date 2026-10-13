import { baseApi } from "./baseApi";

export interface UploadedFileItem {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
}

export interface UploadSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UploadedFileItem;
}

export interface UploadMultipleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UploadedFileItem[];
}

export interface UpdateSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    newImage: UploadedFileItem;
    previousDeleted: boolean;
  };
}

export interface UpdateMultipleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    newImages: UploadedFileItem[];
    deletedCount: number;
  };
}

export interface DeleteFileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    deleted: boolean;
    filename: string;
  };
}

export interface DeleteMultipleFilesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Array<{
    deleted: boolean;
    filename: string;
  }>;
}

export interface UpdateSinglePayload {
  file: File;
  oldUrl?: string;
  oldFilename?: string;
}

export interface UpdateMultiplePayload {
  files: File[];
  oldUrls?: string[];
  oldFilenames?: string[];
}

export interface DeleteImagePayload {
  filename?: string;
  url?: string;
}

export interface DeleteMultipleImagesPayload {
  filenames?: string[];
  urls?: string[];
}

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * 1. Upload a single image
     * POST /api/v1/upload/single
     */
    uploadSingleImage: builder.mutation<UploadSingleResponse, File | FormData>({
      query: (arg) => {
        let body: FormData;
        if (arg instanceof FormData) {
          body = arg;
        } else {
          body = new FormData();
          body.append("file", arg);
        }
        return {
          url: "/upload/single",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    /**
     * 2. Upload multiple images
     * POST /api/v1/upload/multiple
     */
    uploadMultipleImages: builder.mutation<
      UploadMultipleResponse,
      File[] | FormData
    >({
      query: (arg) => {
        let body: FormData;
        if (arg instanceof FormData) {
          body = arg;
        } else {
          body = new FormData();
          arg.forEach((file) => body.append("files", file));
        }
        return {
          url: "/upload/multiple",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    /**
     * 3. Update / Replace a single image and delete the old one
     * PUT /api/v1/upload/single
     */
    updateSingleImage: builder.mutation<
      UpdateSingleResponse,
      UpdateSinglePayload | FormData
    >({
      query: (arg) => {
        let body: FormData;
        if (arg instanceof FormData) {
          body = arg;
        } else {
          body = new FormData();
          body.append("file", arg.file);
          if (arg.oldUrl) body.append("oldUrl", arg.oldUrl);
          if (arg.oldFilename) body.append("oldFilename", arg.oldFilename);
        }
        return {
          url: "/upload/single",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    /**
     * 4. Update / Replace multiple images and delete the old ones
     * PUT /api/v1/upload/multiple
     */
    updateMultipleImages: builder.mutation<
      UpdateMultipleResponse,
      UpdateMultiplePayload | FormData
    >({
      query: (arg) => {
        let body: FormData;
        if (arg instanceof FormData) {
          body = arg;
        } else {
          body = new FormData();
          arg.files.forEach((file) => body.append("files", file));
          if (arg.oldUrls && arg.oldUrls.length > 0) {
            arg.oldUrls.forEach((url) => body.append("oldUrls", url));
          }
          if (arg.oldFilenames && arg.oldFilenames.length > 0) {
            arg.oldFilenames.forEach((fn) => body.append("oldFilenames", fn));
          }
        }
        return {
          url: "/upload/multiple",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    /**
     * 5. Delete a single image by URL or filename
     * DELETE /api/v1/upload/:filename OR DELETE /api/v1/upload
     */
    deleteImage: builder.mutation<
      DeleteFileResponse,
      DeleteImagePayload | string
    >({
      query: (arg) => {
        if (typeof arg === "string") {
          return {
            url: `/upload/${encodeURIComponent(arg)}`,
            method: "DELETE",
          };
        }
        if (arg.filename && !arg.url) {
          return {
            url: `/upload/${encodeURIComponent(arg.filename)}`,
            method: "DELETE",
          };
        }
        return {
          url: "/upload",
          method: "DELETE",
          body: arg,
        };
      },
      invalidatesTags: ["Upload"],
    }),

    /**
     * 6. Delete multiple images
     * DELETE /api/v1/upload/multiple
     */
    deleteMultipleImages: builder.mutation<
      DeleteMultipleFilesResponse,
      DeleteMultipleImagesPayload
    >({
      query: (body) => ({
        url: "/upload/multiple",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useUpdateSingleImageMutation,
  useUpdateMultipleImagesMutation,
  useDeleteImageMutation,
  useDeleteMultipleImagesMutation,
} = uploadApi;
