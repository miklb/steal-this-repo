# Steal This Repo

Welcome to Jekyll-Indieweb starter repository. The goal of this project was to provide someone without a web presence a quick and easy way to start using the basics of the [Indieweb](https://indiewebcamp.com)

This adjacent project will be kept up to date to allow someone to get started and gain the improvements and keep customizations to the theme.

Previously, if you forked Jekyll-IndieWeb you would have to port over any changes. With its conversion to a Jekyll theme, this project will start there, using a white listed plugin remote themes. Over time, I intend to add examples of GitHub Actions to build the site and send/received webmentions.

## Installation

This web site template can be run with a standalone [Jekyll](https://jekyllrb.com/) or, even easier, using [GitHub Pages](https://pages.github.com). Using the latter you'll have your web site up and running in minutes if you follow these steps:

1. Create a [GitHub](https://github.com) account if you haven't already.
2. Fork [this repository](https://github.com/miklb/streal-this-repo) to create a copy of it in your own GitHub account.
3. Change the name of the repository to _somestring_.github.io (e.g. _myindiewebpage.github.io_).
4. Use GitHub's own editor to change a file (e.g. the _about.md_ in the root of the repository) and commit the change.
5. You did it. Your web site should now be available via http://_somestring_.github.io (e.g. http://myindiewebpage.github.io).

## Usage

If you use the GitHub pages workflow described in the _Installation_ section, the usage of this template is fairly simple. Everytime you change something at your web site and commit this change using _git commit_ or the GitHub editor, Jekyll is triggered and your website is redeployed at the URL specified by your repository name (in the example above http://myindiewebpage.github.io).

A note about remote themes — updates to the parent theme (Jekyll IndieWeb) will not automatically be added to your site. Since GitHub Pages serve static sites, you will need to trigger a new build to get the new changes. As time goes by, this should be less of an issue, but during development you may not see bug fixes until your site rebuilds. One hack is to use the `build:` line to your config file. Incrementing that number will make sure that GitHub Pages will trigger a full rebuild.colophon

