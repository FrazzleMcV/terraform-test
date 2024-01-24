import React, {useState, FC, FormEvent} from "react";

interface Props {
    onSubmit: (data: { title: string; description: string }) => void;
}

const FormComponent: FC<Props> = ({onSubmit}) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({title, description});
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                required
            />
            <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default FormComponent;