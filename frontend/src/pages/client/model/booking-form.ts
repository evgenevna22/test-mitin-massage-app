type BookingFormFieldDefinition = {
  type: 'string' | 'boolean';
  required: boolean;
};

export const BOOKING_FORM_FIELDS = {
  slotId: { type: 'string', required: true },
  date: { type: 'string', required: true },
  time: { type: 'string', required: true },
  userName: { type: 'string', required: true },
  massageType: { type: 'string', required: true },
  comment: { type: 'string', required: false },
  is90MinuteMassage: { type: 'boolean', required: false },
} as const satisfies Record<string, BookingFormFieldDefinition>;

export type BookingFormField = keyof typeof BOOKING_FORM_FIELDS;

type BookingFormFieldValue<Definition extends BookingFormFieldDefinition> =
  Definition['type'] extends 'string' ? string : boolean;

type RequiredBookingFormField = {
  [Field in BookingFormField]: (typeof BOOKING_FORM_FIELDS)[Field]['required'] extends true
    ? Field
    : never;
}[BookingFormField];

type OptionalBookingFormField = Exclude<
  BookingFormField,
  RequiredBookingFormField
>;

export type BookingForm = {
  [Field in RequiredBookingFormField]: BookingFormFieldValue<
    (typeof BOOKING_FORM_FIELDS)[Field]
  >;
} & {
  [Field in OptionalBookingFormField]?: BookingFormFieldValue<
    (typeof BOOKING_FORM_FIELDS)[Field]
  >;
};

export const REQUIRED_BOOKING_FORM_FIELDS = Object.entries(BOOKING_FORM_FIELDS)
  .filter(([, definition]) => definition.required)
  .map(([field]) => field as RequiredBookingFormField);

export type BookingFormErrors = Partial<Record<BookingFormField, string>>;
