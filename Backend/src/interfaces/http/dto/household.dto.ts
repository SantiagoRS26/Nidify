export interface CreateHouseholdRequestDto {
  name: string;
  baseCurrency: string;
}

export interface InviteRequestDto {
  email: string;
}

export interface AcceptInvitationRequestDto {
  token: string;
}
