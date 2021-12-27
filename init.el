;; This init file is descended from the systemcrafters
;;   Build Your Website with Org Mode blog at
;;     https://systemcrafters.net/publishing-websites-with-org-mode/building-the-site/

;; Disable backup files
(setq make-backup-files nil)

;; Load the publishing system
(require 'ox-publish)

;; Customize the HTML output
(setq org-html-validation-link nil            ;; Don't show validation link
      org-html-head-include-scripts nil       ;; Use our own scripts
      org-html-head-include-default-style nil ;; Use our own styles
      org-html-head "<link rel=\"stylesheet\" href=\"https://cdn.simplecss.org/simple.min.css\" />")

;; Define the publishing project
(setq org-publish-project-alist
      (list
       (list "titan-mage"
             :recursive t
             :base-directory "./manuals"
             :publishing-function 'org-html-publish-to-html
             :publishing-directory "./build"
             :with-author nil           ;; Don't include author name
             :with-creator t            ;; Include Emacs and Org versions in footer
             :with-toc t                ;; Include a table of contents
             :section-numbers nil       ;; Don't include section numbers
             :time-stamp-file nil)))    ;; Don't include time stamp in file

;; Generate the site output
(org-publish-all t)

(message "Build complete!")
