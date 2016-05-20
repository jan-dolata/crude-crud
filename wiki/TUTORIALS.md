# Tutorials

[Readme](README.md)

# Table of content
- [List with pre filtered collection (many-to-many relationship)](#list-with-pre-filtered-collection-(many-to-many-relationship))

## List with pre filtered collection (many-to-many relationship)

Database

```php
    Schema::create('books', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('name');
        ...
    });

    Schema::create('authors', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('name');
        ...
    });

    Schema::create('book_authors', function (Blueprint $table) {
        $table->increments('id');
        $table->integer('book_id');
        $table->integer('author_id');
    });
```

`App\Engine\Models\BookAuthor`

```php
namespace App\Engine\Models;

use Illuminate\Database\Eloquent\Model;

class BookAuthor extends Model
{
    protected $fillable = [
        'book_id',
        'author_id'
    ];
}

```

`routes.php`

```php
    Route::get('book-authors/{book_id?}', 'Controller@bookAuthors');
```

`App\Http\Controllers\Controller.php`

```php
    public function bookAuthors($book_id = null)
    {
        Session::put('crude.book_authors.book_id', $book_id);
        return view('crude.start', [
            'crudeSetup' => [(new \App\Engine\Crude\BookAuthors)->getCrudeSetupData()]
        ]);
    }
```

`App\Engine\Crude\BookAuthors.php`

```php
namespace App\Engine\Crude;

use Session;

class BookAuthors extends \Crude implements
    \CrudeListInterface,
    \CrudeStoreInterface,
    \CrudeUpdateInterface,
    \CrudeDeleteInterface,
    \CrudeWithValidationInterface
{
    use \CrudeFromModelTrait;
    use \CrudeWithValidationTrait;

    protected $book_id = null;

    public function __construct()
    {
        if (Session::has('crude.book_authors.book_id'))
            $this->book_id = Session::get('crude.book_authors.book_id');

        $this->setModel(new \App\Engine\Models\BookAuthor);

        $this->prepareCrudeSetup();

        $this->crudeSetup
            ->setTitle('Book authors list')
            ->setTypesGroup('autocomplete', ['book_id', 'author_id'])
            ->setColumn(['id', 'book_name', 'author_name'])
            // default value, based on model $fillable
            // ->setAddAndEditForm(['book_id', 'author_id'])
            ;

        if ($this->book_id)
            $this->crudeSetup
                ->setColumn(['id', 'author_name'])
                ->setModelDefaults('book_id', $this->book_id)
                ->setAddAndEditForm(['author_id'])
                ;

        $this->setValidationRules([
            'book_id' => 'required|numeric',
            'author_id' => 'required|numeric'
        ]);
    }

    public function prepareQuery()
    {
        $query = $this->model
            ->leftJoin('books', 'book_authors.book_id', '=', 'books.id')
            ->leftJoin('authors', 'book_authors.author_id', '=', 'authors.id')
            ->select(
                'book_authors.id',
                'book_authors.book_id',
                'book_authors.author_id',
                'books.name as book_name',
                'authors.name as author_name'
            );

        if ($this->book_id)
            $query->where('book_authors.book_id', $this->book_id);

        return $query;
    }

    public function store($attributes)
    {
        $model = $this->model
            ->where('book_id', $attributes['book_id'])
            ->where('author_id', $attributes['author_id'])
            ->first();

        if ($model == null)
            $model = $this->model->create($attributes);

        return $this->getById($model->id);
    }

    public function autocompleteBookId($term)
    {
        return (new \App\Engine\Models\Book)
            ->where('name', 'like', '%' . $term . '%')
            ->select(
                'id',
                'name as label'
            )
            ->take(10)
            ->get();
    }

    public function labelPlaceId($id)
    {
        $label = (new \App\Engine\Models\Book)
            ->where('id', $id)
            ->select('name as label')
            ->value('label');

        return empty($label) ? '' : $label;
    }

    public function autocompleteAuthorId($term)
    {
        return (new \App\Engine\Models\Author)
            ->where('name', 'like', '%' . $term . '%')
            ->select(
                'id',
                'name as label'
            )
            ->take(10)
            ->get();
    }

    public function labelAuthorId($id)
    {
        $label = (new \App\Engine\Models\Author)
            ->where('id', $id)
            ->select('name as label')
            ->value('label');

        return empty($label) ? '' : $label;
    }
}
```
