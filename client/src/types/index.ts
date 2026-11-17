export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface AddressDetails {
  full_address?: string;
  care_of?: string;
  house?: string;
  street?: string;
  locality?: string;
  district?: string;
  state?: string;
  pincode?: string;
}

export interface Details {
  name?: string;
  dob?: string;
  gender?: string;
  aadhaar_number?: string;
  address?: AddressDetails;
  issued_at?: string;
  updated_at?: string;
}
