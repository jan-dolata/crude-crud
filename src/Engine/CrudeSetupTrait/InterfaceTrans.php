<?php

namespace JanDolata\CrudeCRUD\Engine\CrudeSetupTrait;

trait InterfaceTrans
{
    /**
     * Interface and api labels and messages
     *
     * @var array
     */
    protected $interfaceTrans = [];

    /**
     * Gets the interface and api labels and messages.
     *
     * @return array
     */
    public function getInterfaceTrans()
    {
        $locale = config('app.locale');
        $file = config('crude.defaultInterfaceTrans');

        $this->interfaceTrans = array_merge(
            \Lang::get($file, [], $locale),
            $this->interfaceTrans
        );

        return $this->interfaceTrans;
    }

    public function trans($key, $key2 = null)
    {
        return $key2
            ? $this->getInterfaceTrans()[$key][$key2]
            : $this->getInterfaceTrans()[$key];
    }

    /**
     * Sets the interface and api labels and messages.
     *
     * @param  string|array $attr
     * @param  array $value
     *
     * @return self
     */
    public function setInterfaceTrans($attr, $value = null)
    {
        if (is_array($attr))
            $this->interfaceTrans = array_merge($this->interfaceTrans, $attr);
        else
            $this->interfaceTrans[$attr] = $value;

        return $this;
    }
}
