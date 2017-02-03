<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait DateTimePickerOptions
{
    /**
     * Model trans
     *
     * @var array
     */
    protected $dateTimePickerOptions = [
        'format' => 'YYYY-MM-DD hh:mm:00',
        'pickerPosition' => "bottom-left",
        'pickSeconds' => true,
        'icons' => [
            'time'  => "fa fa-clock-o",
            'date'  => "fa fa-calendar",
            'up'    => "fa fa-arrow-up",
            'down'  => "fa fa-arrow-down"
        ]
    ];

    /**
     * Gets the Model datetimepickerOptions.
     *
     * @return array
     */
    public function getDateTimePickerOptions()
    {
        if (! isset($this->dateTimePickerOptions['language']))
            $this->dateTimePickerOptions['language'] = config('app.locale');

        $available = ['en', 'pl', 'sv', 'de'];
        $this->dateTimePickerOptions['language'] =
            in_array($this->dateTimePickerOptions['language'], $available)
                ? $this->dateTimePickerOptions['language'] : 'en';

        return $this->dateTimePickerOptions;
    }

    /**
     * Sets the Model datetimepickerOptions.
     *
     * @param  string|array $attr
     * @param  array $option = null
     *
     * @return self
     */
    public function setDateTimePickerOptions($attr, $option = null)
    {
        $options = is_array($attr)
            ? $attr
            : [$attr => $option];

        foreach ($options as $key => $value)
            $this->dateTimePickerOptions[$key] = $value;

        return $this;
    }
}
