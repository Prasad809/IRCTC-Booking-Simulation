import routingConfig from "./routingConfig.json";

const pushPage = (id) => {
    const page = routingConfig?.headComponents?.find(
        (item) => String(item.id) === String(id)
    );
    if (!page) {
        console.error("Page not found for id:", id);
        return null;
    }
    const path = page.path?.trim();
    if (!path) {
        console.error("Path not found:", page);
        return null;
    }
    const cleanPath = path.replace(/^['"]|['"]$/g, "");
    return cleanPath;
};

export default pushPage;