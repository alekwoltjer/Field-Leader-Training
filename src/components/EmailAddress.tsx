/** Lets long addresses wrap at the "@" instead of overflowing or breaking mid-word. */
export function EmailAddress({ email }: { email: string }) {
  const at = email.indexOf("@");
  if (at === -1) return <>{email}</>;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}
