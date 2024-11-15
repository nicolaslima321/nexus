interface ITitle {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text: string;
}

export default function Title({ variant = 'h3', text }: ITitle) {
  switch (variant) {
    case 'h1':
      return <h1 className="text-5xl font-extrabold text-black">{text}</h1>;
    case 'h2':
      return <h2 className="text-4xl font-bold text-black">{text}</h2>;
    case 'h3':
      return <h3 className="text-3xl font-bold text-black">{text}</h3>;
    case 'h4':
      return <h4 className="text-2xl font-bold text-black">{text}</h4>;
    case 'h5':
      return <h5 className="text-xl font-bold text-black">{text}</h5>;
    case 'h6':
      return <h6 className="text-lg font-bold text-black">{text}</h6>;
    default:
      return <p className="text-md">{text}</p>;
  }
};
