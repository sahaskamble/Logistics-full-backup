import { useContext, createContext, useState } from "react"

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
	const [open, setOpen] = useState(true);
	const [title, setTitle] = useState('');

	return (
		<SidebarContext.Provider value={{ open, setOpen, title, setTitle }}>
			{children}
		</SidebarContext.Provider >
	);
}

export const useSidebar = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};
