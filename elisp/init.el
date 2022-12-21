;; This init file is descended from the systemcrafters
;;   Build Your Website with Org Mode blog at
;;     https://systemcrafters.net/publishing-websites-with-org-mode/building-the-site/

;; Disable backup files
(setq make-backup-files nil)

;; Load the publishing system
(require 'ox-publish)
(require 'ox)

(load-file "elisp/unpackaged.el")

;; Replace the org-export-get-reference function
(advice-add #'org-export-get-reference :override #'unpackaged/org-export-get-reference)

;; Customize the HTML output
(setq org-html-validation-link nil            ;; Don't show validation link
      org-html-head-include-scripts nil       ;; Use our own scripts
      org-html-head-include-default-style nil ;; Use our own styles
      org-html-postamble nil                  ;; Remove the emacs and org version from the end of files
      org-html-home/up-format "
<div id=\"org-div-home-and-up\">
  <a href=\"./index.html\">HOME</a>
</div>
"
      org-html-head (concat
                     "<link rel=\"stylesheet\" href=\"./sakura-light-solarized.css\" type=\"text/css\">"
                     "<script src=\"./setup.js\"></script>"))

;; Define the publishing project
(setq org-publish-project-alist
      (list
       (list "titan-mage"
             :recursive t
             :base-directory "./org-files"
             :publishing-function 'org-html-publish-to-html
             :publishing-directory "./build"
             :headline-levels 6         ;; Don't turn headlines into lists
             :with-author nil           ;; Don't include author name
             :with-creator nil          ;; Don't include Emacs and Org versions in footer
             :with-toc nil              ;; Don't include a table of contents
             :section-numbers nil       ;; Don't include section numbers
             :time-stamp-file nil)))    ;; Don't include time stamp in file

;; Generate the site output
(org-publish-all t)

(message "Build complete!")
