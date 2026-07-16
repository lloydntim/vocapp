const logoClass =
  'flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.02em] no-underline text-inherit';

const logoDot =
  'size-[9px] rounded-full bg-[var(--brand)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_20%,transparent]';

function Logo() {
  return (
    <span className={logoClass}>
      <span className={logoDot}></span>
      <b>Voc</b>
      <span>App</span>
    </span>
  );
}

export default Logo;
