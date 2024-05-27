# Vital

# Libraries Used:

Vite for bundling / server / hot loading
Tailwind for the CSS
Jest / Reactt TResting Libvrary for tests

# Notes

The general design closely mirrors the Vital dashboard where possible to better illustrate how this feature would fit in to the current Vital dashboard.

I have added the ability to select the lab as well as the biomarkers.  This seemed like the cleanest way to select a full set of biomarkers.

I added the ability to edit the panels and pagination over 10 items.  The pagination is simple but functional enought to add the feature.  

The form validation in the Panel component is simple but works and mimics your own approach somewhat in your dashboard.

I have added some tests to the SelectMenu, MultiSelect, Panels and Panel components and useStorage hook.  This is not all components / hooks but should give a flavour.  Tests can be run with `yarn test`

# In repsponse to your question about feedback on the api/docs:

The lab and biomarker api responses are different, I assume due to dataset size.  It would be easier to work with on the frontend if both had a similar response structure 
i.e. {
  data: [], // instead of markers
  page: 1,
  pages: 2,
  size: 50,
  total: 50
}
I would use 'limit' instead of 'size' but that is a personal preference and I would use 'offset' instead of 'pages' as I think it is more flexible as it allows for different perPage values.  

Also 'Total' seems superfluous as it can be derived from data.length, whereas totalResults would be more useful especially if used with 'offset'.

Being able to query the data would help with a better implmentation of the Biomarker multi-select so the text filter would done via the api and would then not require all results to be fetched in advance.  In addition to this I would also want the ability to sort via popularity or similar so the default set of results prior to text filter could show regularly selected biomarkers (e.g. 10/20 items).  However the ability to browse rather than search may be better if users are not familiar with the dataset options.

## Running the project

Build the image:

`docker build -t vital .`

To run this project:

`docker run --rm -p 8000:8000 vital`