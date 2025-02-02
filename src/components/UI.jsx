import { useFont, useGLTF } from "@react-three/drei";
import { atom, useAtom } from "jotai";

export const themeAtom = atom("space");

export const THEMES = {
  space: {
    key: "space",
    skyColor: "#000000",
    sunColor: "#e1ae4e",
    groundColor: "#333333",
    title: "Space",
    subtitle: "World",
    models: [`Koi_08`],
    dof: false,
  },
};

Object.values(THEMES).forEach((theme) => {
  theme.models.forEach((model) => useGLTF.preload(`/models/${model}.glb`));
});

useFont.preload("/fonts/Poppins Black_Regular.json");

export const UI = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-center items-center flex-col">
        <a
          className="pointer-events-auto absolute top-10 left-10"
          href="https://lessons.wawasensei.dev/courses/react-three-fiber"
        >
        </a>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(0,0,0,0.0)_70%,rgba(0,0,0,1)_170%)]" />
        <div className="absolute z-10 pointer-events-auto flex flex-col items-center justify-center bottom-0 w-screen p-10 gap-2">
          <div className="flex gap-2 items-center justify-center">
          </div>
        </div>
      </main>
    </>
  );
};
