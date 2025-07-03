import { toast } from "sonner";

export function showSuccessToast(message: string) {
  toast.success(message);
}

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showProfileIncompleteToast() {
  toast("Almost done! Please complete your profile.");
}

export function showAccountCreatedToast() {
  toast.success("Account created! Please sign in.");
}
