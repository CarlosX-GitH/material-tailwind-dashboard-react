import PropTypes from "prop-types";
import { icons } from "lucide-react";
const Icon = ({ name, color, size }) => {
  const LucideIcon = icons[name];
  return (
    <div className="mr-2 h-4 w-4">
      <LucideIcon color={color} size={size} />
    </div>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
};
export default Icon;