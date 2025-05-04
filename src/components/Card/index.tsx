import { ReactNode } from "react";

import 'src/components/Card/card.less';

type CardProps = {
    index: string;
    title: ReactNode;
    icon: ReactNode;
};

const Card = ({index, title, icon}: CardProps) => {
    return (
      <div className="card">
        <div className="card-index">{index}.</div>
        <div className="card-icon">{icon}</div>
        <div className="card-title">{title}</div>
      </div>
    );
}

export { Card };