import { baseApi } from "./baseApi";

export type ReminderStatus = "PENDING" | "TAKEN" | "SKIPPED";
export type MealTiming = "BEFORE_MEAL" | "AFTER_MEAL" | "WITH_MEAL" | "EMPTY_STOMACH";

export interface PrescriptionItemData {
  id: string;
  prescriptionId?: string;
  medicineName: string;
  genericName?: string | null;
  dosageForm?: string | null;
  schedulePattern: string;
  mealTiming: MealTiming;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineReminderData {
  id: string;
  patientId: string;
  prescriptionItemId: string;
  intakeTime: string;
  status: ReminderStatus;
  acknowledgedAt?: string | null;
  familyMemberId?: string | null;
  createdAt: string;
  updatedAt: string;
  prescriptionItem: PrescriptionItemData;
}

export interface RemindersResponseData {
  reminders: MedicineReminderData[];
  complianceRate: number;
  summary: {
    total: number;
    taken: number;
    pending: number;
    skipped: number;
  };
}

export interface RemindersApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RemindersResponseData;
}

export interface SingleReminderResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: MedicineReminderData;
}

export interface CreateReminderPayload {
  medicineName: string;
  genericName?: string;
  dosageForm?: string;
  schedulePattern?: string;
  mealTiming?: MealTiming;
  durationDays?: number;
  intakeTime?: string;
  notes?: string;
}

export const remindersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<RemindersApiResponse, { patientId?: string } | void>({
      query: (params) => ({
        url: "/reminders",
        params: params ? { patientId: params.patientId } : undefined,
      }),
      providesTags: ["Reminders"],
    }),

    createReminder: builder.mutation<SingleReminderResponse, CreateReminderPayload>({
      query: (body) => ({
        url: "/reminders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Reminders", "Stats"],
    }),

    acknowledgeReminder: builder.mutation<
      any,
      { id: string; status: ReminderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/reminders/${id}/acknowledge`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Reminders", "Stats"],
    }),

    snoozeReminder: builder.mutation<
      any,
      { id: string; minutes?: number }
    >({
      query: ({ id, minutes = 15 }) => ({
        url: `/reminders/${id}/snooze`,
        method: "PUT",
        body: { minutes },
      }),
      invalidatesTags: ["Reminders", "Stats"],
    }),

    deleteReminder: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/reminders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reminders", "Stats"],
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useCreateReminderMutation,
  useAcknowledgeReminderMutation,
  useSnoozeReminderMutation,
  useDeleteReminderMutation,
} = remindersApi;
