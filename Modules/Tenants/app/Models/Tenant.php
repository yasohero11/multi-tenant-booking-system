<?php

namespace Modules\Tenants\App\Models;

use Spatie\Multitenancy\Models\Tenant as BaseTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tenant extends BaseTenant
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
    ];

    public function users()
    {
        return $this->hasMany(\Modules\Users\App\Models\User::class);
    }

    public function teams()
    {
        return $this->hasMany(\Modules\Teams\App\Models\Team::class);
    }
}
