# Integration Lab

Practice on paper, reveal a hint or worked solution, then mark the question solved
or save it for review. The built-in course contains 120 exercises, including 96
parameter variants across 24 problem types. It stores progress and custom courses
in the current browser. Use **Download backup** and **Import JSON** to carry them
to another browser or device.

## Run locally

Run `python -m http.server 8000 --directory dist` and open http://localhost:8000.
The service worker caches the app and its built-in question bank. First open the
site online and wait for **Ready for offline practice**. Source links lead to
external pages and require internet access.

## Add another course

Download or copy `dist/course-template.json`. Give each course a unique ID.
Each topic has a title, a study rule, and questions with a prompt, problem, hint,
and solution. Import the JSON from the app. If you change the question order or
replace questions, use a new course ID so progress stays tied to the old version.

## GitHub Pages

Push the project to a private GitHub repo with `main` or `master` as the default branch.
In **Settings → Pages**, set **Source** to **GitHub Actions**, then run the
**Publish GitHub Pages** workflow. It publishes the `dist` directory. GitHub Pro
or another eligible plan is required for Pages from a private repo. GitHub Pages
visibility is controlled separately from repository visibility.
