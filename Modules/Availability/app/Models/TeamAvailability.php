<?php

namespace Modules\Availability\App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\BelongsToTenant;

class TeamAvailability extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'team_id',
        'weekday',
        'start_time',
        'end_time',
    ];

    public function tenant()
    {
        return $this->belongsTo(\Modules\Tenants\App\Models\Tenant::class);
    }

    public function team()
    {
        return $this->belongsTo(\Modules\Teams\App\Models\Team::class);
    }

    public function getStartTimeAttribute($value)
    {
        return date('H:i', strtotime($value));
    }

    public function getEndTimeAttribute($value)
    {
        return date('H:i', strtotime($value));
    }
}
