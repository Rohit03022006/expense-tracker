import { useAuth } from "../context/AuthContext";
import { formatCurrency as baseCurrency } from "../utils/formatters";

export const useCurrency = () => {
  const { user } = useAuth();

  const formatCurrency = (amount) => {
    return baseCurrency(amount, user?.currency || "INR");
  };

  return { formatCurrency, currency: user?.currency || "INR" };
};
