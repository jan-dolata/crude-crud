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
        'language' => 'pl',
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
        return $this->dateTimePickerOptions;
    }

    /**
     * Sets the Model dropzoneTrans.
     *
     * @param  string|array $attr
     * @param  array $dropzoneTrans = null
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
