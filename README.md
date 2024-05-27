
## Libraries Used:

Vite for bundling / server / hot loading
Tailwind for the CSS
Jest / React Testing Library for tests

## Notes

The general design closely mirrors the Vital dashboard where possible to better illustrate how this feature would fit into the current Vital dashboard.

I have added the ability to select the lab as well as the biomarkers.  This seemed like the cleanest way to select a full set of biomarkers.

I added the ability to edit the panels and pagination over 10 items.  The pagination is simple but functional enough to add the feature.  

The form validation in the Panel component is simple but works and mimics your own approach somewhat in your dashboard.

I have added some tests to the SelectMenu, MultiSelect, Panels and Panel components and useStorage hook.  This is not all components / hooks but should give a flavour.  Tests can be run with `yarn test`

## In response to your question about feedback on the api/docs:

The lab and biomarker api responses are different, I assume due to dataset size.  It would be easier to work with on the frontend if both had a similar response structure:

i.e. 
```json
{
  data: [],
  page: 1,
  pages: 2,
  size: 50,
  total: 50
}
```

I would use 'limit' instead of 'size' but that is a personal preference and I would use 'offset' instead of 'pages' as I think it is more flexible as it allows for different perPage values.  

Also 'Total' seems superfluous as it can be derived from data.length, whereas totalResults would be more useful especially if used with 'offset'.

Being able to query the data would help with a better implementation of the Biomarker multi-select so the text filter would be done via the api and would then not require all results to be fetched in advance.  In addition to this I would also want the ability to sort by popularity or similar so the default set of results prior to the text filter could show regularly selected biomarkers (e.g. 10/20 items).  However the ability to browse rather than search may be better if users are not familiar with the dataset options.

## Running the project

Build the image:

`docker build -t vital .`

To run this project:

`docker run --rm -p 8000:8000 vital`

## For ease of sharing and viewing I have also deployed this project to vercel which can be viewed at the link below

[https://vital-liard.vercel.app](https://vital-liard.vercel.app)