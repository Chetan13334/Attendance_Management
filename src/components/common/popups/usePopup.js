import { usePopupContext } from "./PopupProvider";

export const usePopup = () => {
  const { showToast, showConfirm } = usePopupContext();
  return { showToast, showConfirm };
};
