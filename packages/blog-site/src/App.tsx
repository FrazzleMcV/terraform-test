import React, {useState, FC, useEffect} from "react";
import FormComponent from "./components/FormComponent";
import ContentList from "./components/ContentList";

const App: FC = () => {
    const [items, setItems] = useState<Array<{ title: string; description: string }>>([]);

    const fetchData = async () => {
        try {
            const response = await fetch("https://e5z33c9ns8.execute-api.us-east-1.amazonaws.com/dev/getBlogEntries");
            const json = await response.json();
            setItems([...items, json]);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        const url = "https://api.adviceslip.com/advice";
        fetchData();
    }, []);

    const submitItem = (entry : any) => fetch('https://e5z33c9ns8.execute-api.us-east-1.amazonaws.com/dev/createBlogEntry', {
        method: 'POST',
        body: entry
    })

    const addItem = (item: { title: string; description: string }) => {
        submitItem({id: Math.random(), ...item}).then(r => fetchData());
    };

    return (
        <div>
            <FormComponent onSubmit={addItem}/>
            <ContentList items={items}/>
        </div>
    );
};

export default App;