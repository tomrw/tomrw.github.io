import React from 'react';

type Props = {
  title: string;
  description?: string;
};

export default function Section({ title, description, children }: React.PropsWithChildren<Props>) {
  return (
    <section style={{ marginTop: 24 }}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div>{children}</div>
    </section>
  );
}
