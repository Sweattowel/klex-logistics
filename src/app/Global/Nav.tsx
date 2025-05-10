type link = {
    linkName: string;
    linkRef: string;
}
export default function Nav() {
    const links: link[] = [
        {
            linkName: "Index",
            linkRef: "/"
        },
        {
            linkName: "Products",
            linkRef: "/Pages/Products"
        },
        {
            linkName: "Profile",
            linkRef: "/Pages/Profile"
        },
        {
            linkName: "Home",
            linkRef: "/"
        },
        {
            linkName: "Home",
            linkRef: "/"
        },
    ]
    return (
        <main className="h-[5vh] sm:w-full  flex flex-row justify-evenly border-b outline mb-5">
            <h1 className="flex justify-center items-center sm:text-[2em] bg-gradient-to-br from-green-600 rounded p-5 m-1 font-bold">
                Klex Logistics
            </h1>
            <ul className="h-full w-[70%] flex justify-evenly align-center">
                {links.map((link : link, index: number) => (
                    <a key={index} href={link.linkRef}
                        className="h-[80%] m-auto sm:p-5 p-1 rounded flex justify-center items-center hover:bg-gradient-to-br hover:from-green-200 transition-all duration-500"
                    >
                        {link.linkName}
                    </a>
                ))}
            </ul>
        </main>
    )
};