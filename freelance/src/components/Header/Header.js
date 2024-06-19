import { HeaderLogo, HeaderView } from "./Style";

export const Header = ({ source }) => {
  return (
    <HeaderView>
      <HeaderLogo source={source} />
    </HeaderView>
  );
};
