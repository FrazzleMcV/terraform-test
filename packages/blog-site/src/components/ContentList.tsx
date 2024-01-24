import React, {FC} from "react";

interface Props {
    items: Array<{ title: string; description: string }>;
}

const ContentList: FC<Props> = ({items}) => (
    <ul>
        {items.map((item, index) => (
            <li key={index}>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
            </li>
        ))}
    </ul>
);

export default ContentList;