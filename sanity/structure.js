import { FileText, Clock, List } from 'lucide-react'

export const myStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // List for all posts
      S.listItem()
        .title('All Posts')
        .icon(FileText)
        .child(S.documentTypeList('post').title('All Posts')),

      S.divider(),

      // List for pending posts specifically
      S.listItem()
        .title('Pending Updates')
        .icon(Clock)
        .child(
          S.documentList()
            .title('Pending Posts')
            .filter('_type == "post" && status == "pending"')
        ),

      S.divider(),

      // Other types if any
      ...S.documentTypeListItems().filter(
        (listItem) => !['post'].includes(listItem.getId())
      ),
    ])
