// TODO:
export default function useCreateConstraints(controls) {
  return controls.elements.reduce((sum, element, idx) => {
    return [...sum, [element]];
  }, []);
}
