import { Form, useLoaderData, Link, redirect,useActionData } from "react-router-dom";
import { statusTextById } from "../../utils";

export async function loader({ params }) {
  const postResponse = await fetch(`/api/posts`);
  const post = await postResponse.json();
  return { post };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const preparedJob = {
    ...updates,
    minSalary: parseInt(updates.minSalary),
    maxSalary: parseInt(updates.maxSalary)
  }
  const response = await fetch(`/api/posts/${params.postId}`, { 
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(preparedJob)
  })
  if (response.ok) {
    return redirect(`/posts/${params.postId}`)
  }
 
}

function EditJob() {
  const { post } = useLoaderData();
  const errors = useActionData();

  const statusOptions = Object.keys(statusTextById).map((id) => {
    return (
      <option key={id} value={id}>
        {statusTextById[id]}
      </option>
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link to={`/posts/${post.id}`}>{"<"} Back</Link>
      <Form method="post" className="selection:bg-blue-200 flex flex-col gap-2">
        <h1 className="text-white">Edit Job Posting</h1>
        {errors && <div className="text-red-500">{errors}</div>}
        <div className="sm:flex gap-2 items-center justify-between">
          <fieldset className="sm:w-1/3 flex flex-col">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              id="status"
              className="border-4 focus:outline-none p-2 h-12"
              defaultValue={post.id}
            >
              {statusOptions}
            </select>
          </fieldset>
          <fieldset className="sm:w-2/3 flex flex-col">
            <label htmlFor="CompanyContact">Company Contact</label>
            <input
              type="email"
              name="companyContact"
              id="CompanyContact"
              className="border-4 focus:outline-none p-2"
              defaultValue={post.title}
            />
          </fieldset>
        </div>
        {/* <div className="sm:flex gap-2 items-center justify-between">
          <fieldset className="sm:w-1/3">
            <label htmlFor="applicationDate">Application Date</label>
            <input
              type="date"
              name="applicationDate"
              id="applicationDate"
              className="border-4 focus:outline-none p-2 w-full"
              defaultValue={post.company}
            />{" "}
          </fieldset>
          <fieldset className="sm:w-1/3">
            <label htmlFor="lastContactDate">Last Contact Date</label>
            <input
              type="date"
              name="lastContactDate"
              id="lastContactDate"
              className="border-4 focus:outline-none p-2 w-full"
              defaultValue={post.lastContactDate}
            />
          </fieldset>
          <fieldset className="sm:w-1/3 flex flex-col">
            <label htmlFor="postDate">Posting Date</label>
            <input
              type="date"
              name="postDate"
              id="postDate"
              className="border-4 focus:outline-none p-2"
              defaultValue={job.postDate}
            />
          </fieldset>
        </div>

        <fieldset className="flex flex-col">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="border-4 focus:outline-none p-2"
            defaultValue={job.title}
          />
        </fieldset>
        <div className="sm:flex gap-2 items-center justify-between">
          <fieldset className="sm:w-[47%] flex flex-col">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              name="company"
              id="company"
              className="border-4 focus:outline-none p-2"
              defaultValue={job.company}
            />
          </fieldset>
          <fieldset className="sm:w-[47%] flex flex-col">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              className="border-4 focus:outline-none p-2"
              defaultValue={job.location}
            />
          </fieldset>
        </div>
        <fieldset className="flex flex-col">
          <label htmlFor="minSalary">Salary Range</label>
          <div className="flex gap-2 items-center justify-between">
            <input
              type="number"
              name="minSalary"
              id="minSalary"
              className="w-[47%] border-4 focus:outline-none p-2"
              defaultValue={job.minSalary}
            />{" "}
            -
            <input
              type="number"
              name="maxSalary"
              id="maxSalary"
              className="w-[47%] border-4 focus:outline-none p-2"
              defaultValue={job.maxSalary}
            />
          </div>
        </fieldset>
        <fieldset className="flex flex-col">
          <label htmlFor="jobPostUrl">Original Job Post URL</label>
          <input
            type="url"
            name="jobPostUrl"
            id="jobPostUrl"
            className="border-4 focus:outline-none p-2"
            defaultValue={job.jobPostUrl}
          />
        </fieldset> */}
        <input
          className="bg-blue-500 hover:bg-blue-600 text-white transition mt-4 py-2 cursor-pointer "
          type="submit"
        ></input>
      </Form>
    </div>
  );
}

export default EditJob;
