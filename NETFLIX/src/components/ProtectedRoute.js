import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import PropTypes from "prop-types"; // PropTypes ekleyin

// ProtectedRoute adında bir fonksiyonel bileşen oluşturun ve children adında bir prop alın
const ProtectedRoute = ({ children }) => {
  // AuthContext'ten gelen user objesini alın
  const { user } = UserAuth();

  // React Router'dan gelen useNavigate fonksiyonunu kullanarak navigasyon işlemini gerçekleştirme fonksiyonunu alın
  const navigate = useNavigate();

  // Eğer kullanıcı yetkilendirilmemişse
  if (!user) {
    // Belirtilen yola (genellikle anasayfa) yönlendirme yapın
    navigate("/");

    // İsterseniz bir yükleme göstergesi veya bir mesaj da döndürebilirsiniz
    return null;
  } else {
    // Kullanıcı yetkilendirilmişse, children prop'unu (bileşenleri) render edin
    return children;
  }
};

// Prop-types ekleyin
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children prop'unun bir React düğümü olması gerektiğini belirtin
};

// ProtectedRoute bileşenini dışa aktarın
export default ProtectedRoute;
