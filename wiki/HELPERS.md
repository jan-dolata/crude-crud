# Crude setup

[Readme](../README.md)

## Table of content
- [Data](#data)
- [Options](#options)
- [Query helper](#query-helper)
- [Files](#files)

## Data

Class `CrudeData`

Flush and set data in session

Methods:

- `public static function put(array $data)`
- `public static function get($attr = null)`

Example:

```php
CrudeData::put([
    'attr_1' => 'value_1',
    'attr_2' => 'value_2'
]);

CrudeData::get(); // => ['attr_1' => 'value_1', 'attr_2' => 'value_2']

CrudeData::get('attr_1'); // => 'value_1'

CrudeData::get('attr_3'); // => null

CrudeData::put([
    'attr_2' => 'value_2'
]);

CrudeData::get() // => ['attr_2' => 'value_2']
```

## Options

Abstract class `CrudeOptions`

Organise select input options.

Methods:

- `public static function getOptions()`
- `public static function getLabel($name)`

Example:

Status option class

```php
<?php
class BookType extends \CrudeOptions
{
    protected $optionsTrans = 'books.types';

    const TYPE_DRAMA = 'drama';
    const TYPE_COMEDY = 'comedy';
    const TYPE_HORROR = 'horror';
}
```

Trans file 'books'

```php
return [
    'types' => [
        'drama' => 'Drama',
        'comedy' => 'Comedy',
        'horror' => 'Horror, S-F'
    ]
];
```

`BookType::getOptions()` result

```php
[
    [
        'id' => 'drama',
        'label' => 'Drama'
    ],
    [
        'id' => 'comedy',
        'label' => 'Comedy'
    ],
    [
        'id' => 'horror',
        'label' => 'Horror, S-F'
    ]
]
```

## Query helper

Class `CrudeQueryHelper`

Methods:

- `public static function join(&$query, $table, $tableKey, $tableToJoin, $tableToJoinKey)`` - join left with deleted_at check
- `public static function joinAndCount(&$query, $table, $tableKey, $tableToJoin, $tableToJoinKey, $countName = null)` - join and add count to select (default count param name is 'num_' . $tableToJoin)

Example:

```php
    $query = (new Book)
        ->select(
            'books.id',
            'books.title',
            'authors.name as author_name'
        );

    QueryHelper::join($query, 'books', 'author_id', 'authors', 'id');
    QueryHelper::joinAndCount($query, 'books', 'id', 'reviews', 'book_id');

    $books = $query->get();

    // models in $books collection, have 4 attributes
    // id, title, author_name, num_reviews
```

## Files

Class `CrudeFiles`

Upload files with crude api.

Methods:

- `public function upload($model, $folderName, $files)`
- `public function delete($model, FileLog $log)`

Example:

```php
    public function uploadFile(Request $request)
    {
        $files = $request->file()['file'];

        $model = new ModelWithFiles();
        $model = (new CrudeFiles)->upload($model, 'CrudeClassName', $files);
    }

    public function deleteFile(Request $request, $modelId)
    {
        $logId = $request->input('file_log_id');
        $model = (new ModelWithFiles())->find($modelId);

        $log = (new CrudeFileLog)->find($logId);
        if (! empty($log)) {
            (new CrudeFiles)->delete($model, $log);
        }

        $model->files = array_filter($model->files, function ($file) use ($logId) {
            return $file['file_log_id'] != $logId;
        });
    }
```
