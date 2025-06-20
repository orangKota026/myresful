import { terser } from "rollup-plugin-terser";

export default {
    input: "src/index.js",
    output: [
        {
            file: "dist/myresful.umd.js",
            format: "umd",
            name: "myresful",
            sourcemap: true,
			globals: {
				axios: "axios"
			}
        },
        {
            file: "dist/myresful.esm.js",
            format: "es",
            sourcemap: true,
        },
    ],
	external: ["axios"],
    plugins: [terser()],
};
