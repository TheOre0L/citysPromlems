
const Footer = () => {
    return (
        <footer className="sticky  bottom-3 w-full">
                <div className={"relative w-full lg:w-10/12 mx-auto "}>
            <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date().getFullYear()} <a href="#"
                                                                                          className="hover:underline">Егор Туманов™</a>. Все права зафырканы.
    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li>
                            <a href="/" className="mr-4 hover:underline md:mr-6 ">Главная</a>
                        </li>
                        <li>
                            <a href="/posts" className="mr-4 hover:underline md:mr-6">Публикации</a>
                        </li>
                    </ul>
                </div>
            </footer>

        </div>
    </footer>

    );
};

export default Footer;