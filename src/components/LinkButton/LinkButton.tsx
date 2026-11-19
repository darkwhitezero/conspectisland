import { Link, type LinkProps } from 'react-router-dom';
import { buttonClasses, type ButtonLook } from '../Button';

/** Переход на другой экран, оформленный как кнопка: семантически это ссылка. */
export function LinkButton({ variant, size, fullWidth, iconOnly, className, ...rest }: LinkProps & ButtonLook) {
  return <Link className={buttonClasses({ variant, size, fullWidth, iconOnly }, className)} {...rest} />;
}
