const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV != undefined && BABEL_ENV !== "cjs";

const plugins = [
  "@babel/plugin-proposal-class-properties",
  "@babel/plugin-proposal-object-rest-spread",
  "dev-expression",
  [
    "transform-react-remove-prop-types",
    {
      mode: "unsafe-wrap",
    },
  ],
  [
    "transform-inline-environment-variables",
    {
      include: ["COMPAT"],
    },
  ],
];

module.exports = function () {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 2,
          loose: true,
          modules: building ? false : "commonjs",
        },
      ],
      "@babel/preset-react",
    ],
    plugins: plugins,
  };
};
