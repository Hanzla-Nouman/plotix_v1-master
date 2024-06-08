import Link from "next/link";

interface TBreadcrumb {
  id: number;
  name: string;
  href: string;
}
interface TBReadcrurmbsProps {
  breadcrumbs: TBreadcrumb[];
}

const Breadcrumbs = (props: TBReadcrurmbsProps) => {
  const { breadcrumbs = [] } = props;
  return (
    <ol className="flex items-center space-x-2 text-sm mb-4">
      {breadcrumbs.map((breadcrumb, i) => (
        <li key={breadcrumb.href}>
          <div className="flex items-center">
            <Link
              href={breadcrumb.href}
              className="font-medium text-muted-foreground hover:text-gray-900"
            >
              {breadcrumb.name}
            </Link>
            {i !== breadcrumbs.length - 1 && (
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
              >
                <path d="m5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};

export default Breadcrumbs;
