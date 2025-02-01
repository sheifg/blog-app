import { useBlogContext } from "../context/BlogContext";

const PaginationComponent = () => {
  // It is taken the benefit from info about pagination in the BlogContext
  const { page, setPage, paginationData } = useBlogContext();
  // It can be used this pagination component in all app that it is being developed, just need to provide the total pages
  const totalPages = paginationData?.totalPages;

  // Generate an array of page numbers
  // First parameter is the iterable
  // This iterable is created as an array by providing the length
  // This will be an empty array that has the length it is provided
  // All the items in this array will undefined
  // So it is used the second parameter to fill the array
  // Second parameter it is a callback function
  // This callback function will updates the values in the array
  // Each time it is returned index + 1 and store it in the array
  // In the end array will be like this [1, 2, 3, 4]
  // Currently there are 24 blogs and 3 pages
  // [1,2,3]
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  console.log(pages);

  return (
    <div className="flex items-center justify-center mt-3">
      <nav aria-label="Page navigation">
        <ul className="inline-flex items-center -space-x-px">
          {/* First Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </button>
          </li>

          {/* Previous Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
          </li>

          {/* Page Number Buttons */}
          {/* [1, 2, 3, 4, 5] */}
          {pages.map((item, index) => (
            <li key={index}>
              <button
                className={`px-3 py-2 border border-gray-300 ${
                  // If the current item is equal to the page, gives the first styling, if not the second
                  item === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
                // When the button is clicked, the page will be updated
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            </li>
          ))}

          {/* Next Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </li>

          {/* Last Page Button */}
          <li>
            <button
              className={`px-3 py-2 border border-gray-300 ${
                page === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200"
              }`}
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationComponent;
