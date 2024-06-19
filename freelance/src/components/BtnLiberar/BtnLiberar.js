import { BtnLiberarTitle, BtnLiberarView } from "./Style";

export const BtnLiberar = ({ onPress, btnTitle }) => {
  return (
    <BtnLiberarView onPress={onPress}>
      <BtnLiberarTitle>{btnTitle}</BtnLiberarTitle>
    </BtnLiberarView>
  );
};
